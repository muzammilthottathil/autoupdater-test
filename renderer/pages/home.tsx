import React, { useEffect, useState } from "react";
import Head from "next/head";

export default function HomePage() {
    const [message, setMessage] = useState<string[]>([]);

    const [version, setVersion] = useState<string>("");

    const getAppVersion = async () => {
        const version = await window.ipc?.invoke("app-version");
        setVersion(version);
    };

    useEffect(() => {
        window.ipc?.on("auto-updater", (data) => {
            setMessage((prev) => [...prev, `[${new Date().toUTCString()}] : ${data}`]);
        });

        getAppVersion();
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Auto Updater Checker</title>
            </Head>
            <div className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="uppercase">Auto Update Checker</h1>
                    <p className="text-xs text-gray-400 font-mono">Version: {version}</p>
                </div>

                <div className="my-6">
                    <p className="font-serif text-xl mb-4 text-yellow-500">Messages</p>
                    <ul className="text-xs font-mono font-light text-gray-300 divide-y divide-gray-700">
                        {message.map((msg, i) => (
                            <li key={i} className="py-1.5">
                                {msg}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
}
