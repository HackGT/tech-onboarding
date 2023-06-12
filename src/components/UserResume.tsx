import { Link, } from '@chakra-ui/react';
import { ExternalLinkIcon, } from '@chakra-ui/icons';
import { apiUrl, Service } from "@hex-labs/core";
import React, { useEffect } from "react";
import axios from "axios";

type Props = {
    user: any;
};

const UserResume: React.FC<Props> = (props: Props) => {
    const [resumeLink, setResumeLink] = React.useState("");
    useEffect(() => {
        if ('resume' in props.user) {
            console.log("resume found");
            const requestUrl = apiUrl(Service.FILES, `/files/${props.user.resume}/view`);
            console.log(`requestUrl: ${requestUrl}`);

            axios.get(requestUrl)
            .then((response => {
                console.log("resume retrieved");
                setResumeLink(response.data);
            }))
        }
    }, []);

    return (
    <Link href={resumeLink} color='blue' isExternal>
        Link to Resume <ExternalLinkIcon mx='2px' />
    </Link>
    );
};

export default UserResume;