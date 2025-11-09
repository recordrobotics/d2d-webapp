"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { NumericFormat } from "react-number-format";
import Section from "./Section";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import PaypalIcon from "./PayPalIcon";
import Button from "@mui/material/Button";
import { db, createDonationId, DonationId } from "@/lib/donation";
import { useRouter } from "next/navigation";
import DonationDeleteAlert from "../DonationDeleteAlert";

const paymentOptions = [
  { label: "Cash", value: "cash", icon: <LocalAtmIcon fontSize="small" /> },
  {
    label: "Check",
    value: "check",
    icon: <CreditCardIcon fontSize="small" />,
  },
  {
    label: "PayPal",
    value: "paypal",
    icon: <PaypalIcon fontSize="small" />,
  },
];

export default function DonationForm({
  newDonation,
}: {
  newDonation?: boolean;
}) {
  const [streetNumberValue, setStreetNumberValue] = useState("");
  const [streetNameValue, setStreetNameValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [donationAmountValue, setDonationAmountValue] = useState("");
  const [donorNameValue, setDonorNameValue] = useState("");
  const [donorEmailValue, setDonorEmailValue] = useState("");
  const [paymentTypeValue, setPaymentTypeValue] = useState("");

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!newDonation) {
      // Load saved donation
      (async () => {
        const donation = await db.donations.get(
          window.location.hash.substring(1)
        );

        if (donation) {
          setStreetNumberValue(donation.address.streetNumber.toString());
          setStreetNameValue(donation.address.streetName);
          setCityValue(donation.address.city);
          setDonationAmountValue(donation.amount.toFixed(2));
          setDonorNameValue(donation.donor.name || "");
          setDonorEmailValue(donation.donor.email || "");
          setPaymentTypeValue(donation.donor.paymentType);
        }
      })();
    } else {
      // Load saved street name and city from db
      (async () => {
        const streetNameSetting = await db.settings.get("streetName");
        const citySetting = await db.settings.get("city");
        if (streetNameSetting) {
          setStreetNameValue(streetNameSetting.value);
        }
        if (citySetting) {
          setCityValue(citySetting.value);
        }
      })();
    }
  }, [newDonation]);

  return (
    <>
      <Section title="Address" divider>
        <Box display="flex" flexDirection="column" gap="9px">
          <Box display="flex" flexDirection="row" gap="13px">
            <NumericFormat
              value={streetNumberValue}
              onChange={(e) => setStreetNumberValue(e.target.value)}
              customInput={TextField}
              allowLeadingZeros={false}
              valueIsNumericString
              allowNegative={false}
              decimalScale={0}
              variant="standard"
              size="medium"
              label="Street number"
              inputMode="numeric"
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                },
              }}
              autoComplete="off"
            />
            <TextField
              variant="standard"
              size="medium"
              label="Street name"
              helperText="Include street type (Street, Avenue, etc.)"
              sx={{
                mb: "-27px",
              }}
              autoComplete="off"
              fullWidth
              value={streetNameValue}
              onChange={(e) => setStreetNameValue(e.target.value.trimStart())}
            />
          </Box>
          <TextField
            variant="standard"
            size="medium"
            label="City / Town"
            autoComplete="off"
            fullWidth
            value={cityValue}
            onChange={(e) => setCityValue(e.target.value.trimStart())}
          />
        </Box>
      </Section>
      <Section title="Donation Amount" divider>
        <NumericFormat
          value={donationAmountValue}
          onChange={(e) => setDonationAmountValue(e.target.value)}
          customInput={TextField}
          thousandSeparator
          valueIsNumericString
          allowNegative={false}
          decimalScale={2}
          fixedDecimalScale
          prefix="$"
          variant="standard"
          size="medium"
          placeholder="$0.00"
          inputMode="decimal"
          slotProps={{
            htmlInput: {
              inputMode: "decimal",
            },
          }}
          autoComplete="off"
          sx={{ width: "123px" }}
        />
      </Section>
      <Section
        title="Donor Information"
        subtitle="Provide additional information about the donor if they are willing."
      >
        <Box display="flex" flexDirection="column" gap="5px">
          <TextField
            variant="standard"
            size="medium"
            label="Name"
            fullWidth
            autoComplete="off"
            value={donorNameValue}
            onChange={(e) => setDonorNameValue(e.target.value.trimStart())}
          />
          <TextField
            variant="standard"
            size="medium"
            label="Email"
            fullWidth
            autoComplete="off"
            type="email"
            value={donorEmailValue}
            onChange={(e) => setDonorEmailValue(e.target.value.trimStart())}
          />
          <TextField
            id="standard-select-currency"
            select
            label="Payment type"
            variant="standard"
            fullWidth
            autoComplete="off"
            value={paymentTypeValue}
            onChange={(e) => setPaymentTypeValue(e.target.value)}
          >
            {paymentOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Section>
      <Box display="flex" flexDirection="row" gap="10px">
        {!newDonation && (
          <Button
            size="large"
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => setOpenDeleteAlert(true)}
          >
            Delete
          </Button>
        )}
        <Button
          size="large"
          color="primary"
          variant="outlined"
          startIcon={<CheckCircleIcon />}
          disabled={
            !streetNumberValue ||
            !streetNameValue ||
            !cityValue ||
            !donationAmountValue ||
            !paymentTypeValue
          }
          onClick={async () => {
            // Save street name and city into db
            if (newDonation) {
              await db.settings.put({
                key: "streetName",
                value: streetNameValue,
              });
              await db.settings.put({ key: "city", value: cityValue });
              await db.settings.put({
                key: "hasAddedAtLeastOneDonation",
                value: "true",
              });
            }

            // Save donation

            const id = newDonation
              ? createDonationId()
              : window.location.hash.substring(1);

            const timestamp = newDonation
              ? Date.now()
              : (await db.donations.get(id))?.timestamp || Date.now();

            await db.donations.put({
              id: id as DonationId,
              timestamp,
              amount: parseFloat(donationAmountValue.replace(/[$,]/g, "")),
              address: {
                streetNumber: parseInt(streetNumberValue),
                streetName: streetNameValue,
                city: cityValue,
              },
              donor: {
                name: donorNameValue || undefined,
                email: donorEmailValue || undefined,
                paymentType: paymentTypeValue as "cash" | "check" | "paypal",
              },
            });

            await db.settings.put({
              key: "donationUpdateTime",
              value: Date.now().toString(),
            });

            // Redirect to home page
            if (
              newDonation &&
              (await db.settings.get("autoAddDonation"))?.value === "true"
            ) {
              setStreetNumberValue("");
              setDonationAmountValue("");
              setDonorNameValue("");
              setDonorEmailValue("");
              setPaymentTypeValue("");

              const streetNameSetting = await db.settings.get("streetName");
              const citySetting = await db.settings.get("city");
              if (streetNameSetting) {
                setStreetNameValue(streetNameSetting.value);
              }
              if (citySetting) {
                setCityValue(citySetting.value);
              }
            } else {
              router.push("/");
            }
          }}
        >
          {newDonation ? "Submit" : "Save"}
        </Button>
      </Box>
      <DonationDeleteAlert
        open={openDeleteAlert}
        handleResponse={async (response) => {
          setOpenDeleteAlert(false);
          if (response === "delete") {
            // Delete donation
            const id = window.location.hash.substring(1);
            await db.donations.delete(id);
            await db.settings.put({
              key: "donationUpdateTime",
              value: Date.now().toString(),
            });
            // Redirect to home page
            router.push("/");
          }
        }}
      />
    </>
  );
}
