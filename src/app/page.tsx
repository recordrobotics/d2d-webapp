"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import PageMotion from "./PageMotion";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Donation, DonationId } from "@/lib/donation";
import DonationItem from "./Donation";
import { useRouter } from "next/navigation";
import {
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import donationlistStyles from "./donationlist.module.css";
import "./donationlist.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useCallback, useEffect, useRef, useState } from "react";
import DonationDeleteAlert from "./DonationDeleteAlert";
import sleep from "sleep-promise";
import TipBanner from "./TipBanner";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import UserNameExistsAlert from "./UserNameExistsAlert";

interface SwipeableListItemInterface {
    wrapperElement: HTMLElement;
    playReturnAnimation: () => void;
    resetState: () => void;
}

interface SnackbarMessage {
    message: string;
    type: "success" | "error";
    key: number;
}

function usePerItemMap<T>() {
    const [map, setMap] = useState<Record<string, T>>({});
    const setItem = (key: string, value: T) =>
        setMap((m) => ({ ...m, [key]: value }));
    return { map, setItem };
}

export default function Home() {
    const donations = useLiveQuery(
        () => db.donations.orderBy("timestamp").reverse().toArray(),
        []
    );
    const userName = useLiveQuery(() => db.settings.get("user.name"), []);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (
                (await db.settings.get("onboardingComplete"))?.value !== "true"
            ) {
                router.replace("/onboarding");
            }
        })();
    }, [router]);

    const { map: alignLeftMap, setItem: setAlignLeftMap } =
        usePerItemMap<boolean>();

    const itemRefMap = useRef<Record<DonationId, SwipeableListItem | null>>({});

    const toRemoveId = useRef<DonationId | null>(null);

    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [userNameExistsAlertOpen, setUserNameExistsAlertOpen] =
        useState(false);

    const markDeleted = (id: DonationId) => {
        toRemoveId.current = id;
        setDeleteAlertOpen(true);
    };

    const [autoAddDonationOnSubmitTipOpen, setAutoAddDonationOnSubmitTipOpen] =
        useState(false);

    useEffect(() => {
        (async () => {
            const setting = await db.settings.get("autoAddDonation");
            if (!setting || setting.value !== "true") {
                const hasInteractedWithTip = await db.settings.get(
                    "hasSeenAutoAddDonationOnSubmitTip"
                );
                if (
                    !hasInteractedWithTip ||
                    hasInteractedWithTip.value !== "true"
                ) {
                    const hasAddedDonation = await db.settings.get(
                        "hasAddedAtLeastOneDonation"
                    );
                    if (hasAddedDonation && hasAddedDonation.value === "true") {
                        setAutoAddDonationOnSubmitTipOpen(true);
                    }
                }
            }
        })();
    }, []);

    const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
    const [publishAlertOpen, setPublishAlertOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(
        undefined
    );

    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setPublishAlertOpen(true);
        } else if (snackPack.length && messageInfo && publishAlertOpen) {
            // Close an active snack when a new one is added
            setPublishAlertOpen(false);
        }
    }, [snackPack, messageInfo, publishAlertOpen]);

    const handleAlertClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setPublishAlertOpen(false);
    };

    const handleAlertExited = () => {
        setMessageInfo(undefined);
    };

    const updateDonations = useCallback(
        async (checkUser: boolean) => {
            setIsUpdating(true);

            await db.settings.put({
                key: "user.lastUpdateAttemptTime",
                value: Date.now().toString(),
            });

            const lastSyncedName = (
                await db.settings.get("user.lastSyncedName")
            )?.value;

            if (
                checkUser &&
                lastSyncedName &&
                userName &&
                userName.value &&
                lastSyncedName !== userName.value
            ) {
                try {
                    const checkUserRes = await fetch("/api/checkUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: userName.value,
                        }),
                    });

                    if (!checkUserRes.ok) {
                        setSnackPack((prev) => [
                            ...prev,
                            {
                                message:
                                    checkUserRes.status === 429
                                        ? "Too many requests. Please try again later."
                                        : "Error updating donations",
                                type: "error",
                                key: new Date().getTime(),
                            },
                        ]);
                        setIsUpdating(false);
                        return;
                    } else {
                        const data = await checkUserRes.json();
                        if (data.exists) {
                            setUserNameExistsAlertOpen(true);
                            return;
                        }
                    }
                } catch {
                    setSnackPack((prev) => [
                        ...prev,
                        {
                            message: "Error updating donations",
                            type: "error",
                            key: new Date().getTime(),
                        },
                    ]);
                    setIsUpdating(false);
                    return;
                }
            }

            const donationUpdateTime = (
                await db.settings.get("donationUpdateTime")
            )?.value;

            try {
                const res = await fetch("/api/donations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        updateTime: donationUpdateTime,
                        lastSyncName: lastSyncedName,
                        name: userName?.value,
                        donations: (donations || []).map((donation) => ({
                            name: userName?.value,
                            ...donation,
                        })),
                    }),
                });

                if (res.ok) {
                    const data = await res.json();

                    await db.settings.put({
                        key: "donationUpdateTime",
                        value: data.updateTime.toString(),
                    });

                    await db.settings.put({
                        key: "user.lastSyncTime",
                        value: Date.now().toString(),
                    });

                    await db.settings.put({
                        key: "user.lastSyncedName",
                        value: userName ? userName.value : "<UNKNOWN>",
                    });

                    await db.settings.put({
                        key: "user.verified",
                        value: "true",
                    });

                    if (donationUpdateTime !== data.updateTime.toString()) {
                        await db.donations.clear();
                        await db.donations.bulkAdd(
                            data.donations.map(
                                (
                                    donation: Donation & { name?: string }
                                ): Donation => ({
                                    id: donation.id,
                                    timestamp: donation.timestamp,
                                    amount: donation.amount,
                                    address: donation.address,
                                    donor: donation.donor,
                                })
                            )
                        );
                    }

                    setSnackPack((prev) => [
                        ...prev,
                        {
                            message: "Donations updated successfully",
                            type: "success",
                            key: new Date().getTime(),
                        },
                    ]);
                    setIsUpdating(false);
                } else {
                    setSnackPack((prev) => [
                        ...prev,
                        {
                            message:
                                res.status === 429
                                    ? "Too many requests. Please try again later."
                                    : "Error updating donations",
                            type: "error",
                            key: new Date().getTime(),
                        },
                    ]);
                    setIsUpdating(false);
                }
            } catch {
                setSnackPack((prev) => [
                    ...prev,
                    {
                        message: "Error updating donations",
                        type: "error",
                        key: new Date().getTime(),
                    },
                ]);
                setIsUpdating(false);
            }
        },
        [
            donations,
            userName,
            setIsUpdating,
            setSnackPack,
            setUserNameExistsAlertOpen,
        ]
    );

    useEffect(() => {
        if (isUpdating) return;

        const timeout = setTimeout(async () => {
            const lastSyncTime = await db.settings.get("user.lastSyncTime");
            const lastUpdateAttemptTime = await db.settings.get(
                "user.lastUpdateAttemptTime"
            );
            if (
                (!lastSyncTime ||
                    !lastSyncTime.value ||
                    Date.now() - parseInt(lastSyncTime.value) >
                        60000) /* 1 minute */ &&
                (!lastUpdateAttemptTime ||
                    !lastUpdateAttemptTime.value ||
                    Date.now() - parseInt(lastUpdateAttemptTime.value) >
                        60000) /* 1 minute */
            ) {
                updateDonations(true);
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, [isUpdating, updateDonations]);

    return (
        <PageMotion>
            <Box
                display="flex"
                flexDirection="column"
                p="20px 19px"
                alignItems="flex-end"
                minHeight="100vh"
                width="100vw"
                maxWidth="600px"
            >
                <Link href="/settings">
                    <Button size="small" color="info" variant="text">
                        Settings
                    </Button>
                </Link>
                <TipBanner
                    open={autoAddDonationOnSubmitTipOpen}
                    closeBanner={(reason) => {
                        setAutoAddDonationOnSubmitTipOpen(false);

                        (async () => {
                            await db.settings.put({
                                key: "hasSeenAutoAddDonationOnSubmitTip",
                                value: "true",
                            });
                        })();

                        if (reason === "agree") {
                            (async () => {
                                await db.settings.put({
                                    key: "autoAddDonation",
                                    value: "true",
                                });
                            })();
                        }
                    }}
                />
                <Box
                    display="flex"
                    flexDirection="column"
                    gap="15px"
                    width="100%"
                    alignItems="center"
                    p="10px"
                >
                    <Typography variant="h6" align="center">
                        Welcome, {userName ? userName.value : "student"}!
                        <Typography variant="body1" component="div">
                            {donations && donations.length > 0
                                ? "You are currently offline. Publishing and fetching donations may not work."
                                : "You have no donations collected yet."}
                        </Typography>
                    </Typography>
                    <Typography variant="h3" align="center">
                        {"$" +
                            (donations
                                ? donations.reduce(
                                      (sum, donation) => sum + donation.amount,
                                      0
                                  )
                                : 0
                            ).toFixed(2)}
                        <Typography variant="body1">Total donated</Typography>
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap="5px"
                        alignItems="center"
                    >
                        <Link href="/donation/add">
                            <Button
                                size="large"
                                color="primary"
                                variant="outlined"
                                startIcon={<Add />}
                            >
                                New Donation
                            </Button>
                        </Link>
                        <Button
                            size="small"
                            color="info"
                            variant="text"
                            disabled={isUpdating}
                            loading={isUpdating}
                            loadingPosition="start"
                            onClick={() => updateDonations(true)}
                        >
                            {donations && donations.length > 0
                                ? "Publish Donations"
                                : "Fetch Donations"}
                        </Button>
                        <Snackbar
                            key={messageInfo ? messageInfo.key : undefined}
                            open={publishAlertOpen}
                            autoHideDuration={6000}
                            onClose={handleAlertClose}
                            slotProps={{
                                transition: { onExited: handleAlertExited },
                            }}
                        >
                            <Alert
                                onClose={handleAlertClose}
                                severity={
                                    messageInfo ? messageInfo.type : "success"
                                }
                                variant="filled"
                                sx={{ width: "100%" }}
                            >
                                {messageInfo ? messageInfo.message : undefined}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
                <SwipeableList
                    className={donationlistStyles.list}
                    destructiveCallbackDelay={150}
                    optOutMouseEvents
                >
                    {donations &&
                        donations.map((donation) => (
                            <SwipeableListItem
                                key={donation.id}
                                ref={(elem) => {
                                    itemRefMap.current = {
                                        ...itemRefMap.current,
                                        [donation.id]: elem,
                                    };
                                }}
                                trailingActions={
                                    <TrailingActions>
                                        <SwipeAction
                                            destructive={true}
                                            onClick={() =>
                                                markDeleted(donation.id)
                                            }
                                        >
                                            <Box
                                                bgcolor="error.main"
                                                display="flex"
                                                flexDirection="row"
                                                p="0 20px"
                                                height="100%"
                                                alignItems="center"
                                                justifyContent="flex-start"
                                            >
                                                <Box
                                                    flexGrow={
                                                        alignLeftMap[
                                                            donation.id
                                                        ]
                                                            ? 0
                                                            : 1
                                                    }
                                                    sx={{
                                                        transition:
                                                            "flex-grow 0.3s",
                                                    }}
                                                />
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                    alignItems="center"
                                                >
                                                    <DeleteForeverIcon
                                                        fontSize="large"
                                                        htmlColor="#fff"
                                                    />
                                                    <Typography
                                                        variant="button"
                                                        color="#fff"
                                                    >
                                                        Delete
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </SwipeAction>
                                    </TrailingActions>
                                }
                                className={donationlistStyles.listItem}
                                onSwipeProgress={(p) =>
                                    setAlignLeftMap(donation.id, p >= 50)
                                }
                            >
                                <DonationItem donation={donation} />
                            </SwipeableListItem>
                        ))}
                </SwipeableList>
            </Box>
            <DonationDeleteAlert
                open={deleteAlertOpen}
                handleResponse={async (response) => {
                    setDeleteAlertOpen(false);
                    if (toRemoveId.current !== null) {
                        const id = toRemoveId.current;
                        toRemoveId.current = null;
                        const itemRef = itemRefMap.current[
                            id
                        ] as SwipeableListItemInterface | null;

                        if (!itemRef) {
                            return;
                        }

                        if (response === "delete") {
                            itemRef.wrapperElement.className =
                                "swipeable-list-item swipeable-list-item--remove " +
                                donationlistStyles.removing;
                            await sleep(350);
                            await db.donations.delete(id);
                            await db.settings.put({
                                key: "donationUpdateTime",
                                value: Date.now().toString(),
                            });
                        } else {
                            itemRef.playReturnAnimation();
                            itemRef.resetState();
                            itemRef.wrapperElement.className =
                                "swipeable-list-item";
                        }
                    }
                }}
            />
            <UserNameExistsAlert
                open={userNameExistsAlertOpen}
                handleResponse={async (response) => {
                    setUserNameExistsAlertOpen(false);
                    if (response === "overwrite") {
                        updateDonations(false);
                    } else {
                        setIsUpdating(false);
                    }
                }}
            />
        </PageMotion>
    );
}
