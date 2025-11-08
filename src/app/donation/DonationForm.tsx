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
import { useState } from "react";
import PaypalIcon from "./PayPalIcon";
import Button from "@mui/material/Button";

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
  const [donationAmountValue, setDonationAmountValue] = useState("");

  return (
    <>
      <Section title="Address" divider>
        <Box display="flex" flexDirection="column" gap="9px">
          <Box display="flex" flexDirection="row" gap="13px">
            <TextField
              variant="standard"
              size="medium"
              label="Street number"
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                },
              }}
              inputMode="numeric"
              autoComplete="off"
            />
            <TextField
              variant="standard"
              size="medium"
              label="Street name"
              autoComplete="off"
              fullWidth
            />
          </Box>
          <TextField
            variant="standard"
            size="medium"
            label="City / Town"
            autoComplete="off"
            fullWidth
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
          />
          <TextField
            variant="standard"
            size="medium"
            label="Email"
            fullWidth
            autoComplete="off"
            type="email"
          />
          <TextField
            id="standard-select-currency"
            select
            label="Payment type"
            variant="standard"
            fullWidth
            autoComplete="off"
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
          >
            Delete
          </Button>
        )}
        <Button
          size="large"
          color="primary"
          variant="outlined"
          startIcon={<CheckCircleIcon />}
        >
          {newDonation ? "Submit" : "Save"}
        </Button>
      </Box>
    </>
  );
}
