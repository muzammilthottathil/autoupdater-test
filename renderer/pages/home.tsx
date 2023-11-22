import React from "react";
import Head from "next/head";

export default function HomePage() {
    return (
        <React.Fragment>
            <Head>
                <title>Home - Nextron (with-tailwindcss)</title>
            </Head>
            <div className="grid grid-col-1 text-2xl w-full text-center">
                <h1>Hello 123</h1>
            </div>
        </React.Fragment>
    );
}
