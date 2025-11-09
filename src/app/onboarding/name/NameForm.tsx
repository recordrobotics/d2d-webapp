"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import NameMessage from "./NameMessage";
import { db } from "@/lib/donation";

export default function NameForm() {
    const [name, setName] = useState("");
    const isValid = name.trim().length > 0;
    const [message, setMessage] = useState<
        "loading" | "already_used" | "not_verified" | "verified" | null
    >(null);

    useEffect(() => {
        // Get name from db
        (async () => {
            const userName = await db.settings.get("user.name");
            if (userName && userName.value) {
                setName(userName.value);
            }
        })();
    }, []);

    useEffect(() => {
        if (isValid) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessage("loading");
            const timeout = setTimeout(() => {
                (async () => {
                    try {
                        const checkUserRes = await fetch("/api/checkUser", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name,
                            }),
                        });

                        if (!checkUserRes.ok) {
                            setMessage("not_verified");
                        } else {
                            const data = await checkUserRes.json();
                            if (data.exists) {
                                setMessage("already_used");
                            } else {
                                setMessage("verified");
                            }
                        }
                    } catch {
                        setMessage("not_verified");
                    }
                })();
            }, 1000); // Debounce by 1000ms

            return () => clearTimeout(timeout);
        } else {
            setMessage(null);
        }
    }, [name, isValid]);

    return (
        <>
            <TextField
                variant="standard"
                size="medium"
                label="Your name"
                fullWidth
                value={name}
                onChange={async (e) => setName(e.target.value.trimStart())}
                autoComplete="name"
                aria-label="Your name"
            />
            <Link
                style={{
                    cursor: "default",
                }}
                href={isValid ? "/onboarding/offline" : "#"}
            >
                <Button
                    size="large"
                    color="primary"
                    disabled={!isValid}
                    variant="outlined"
                    endIcon={<ChevronRight />}
                    onClick={async () => {
                        // Save name to db
                        await db.settings.put({
                            key: "user.name",
                            value: name.trim(),
                        });
                        await db.settings.put({
                            key: "user.lastSyncedName",
                            value: name.trim(),
                        });
                    }}
                >
                    Continue
                </Button>
            </Link>
            <NameMessage message={message} />
        </>
    );
}
