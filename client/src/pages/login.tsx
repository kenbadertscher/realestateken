import { useEffect, useRef } from "react";
import { useLogin } from "@pankod/refine-core";
import { Container, Box, Button, Typography, Divider } from "@pankod/refine-mui";

import yariga from 'assets/yariga.svg';

import { CredentialResponse } from "../interfaces/google";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const handleGuestLogin = () => {
    // Create a guest user object
    const guestUser = {
      name: "Guest User",
      email: "guest@example.com",
      avatar: "https://via.placeholder.com/150/CCCCCC/666666?text=G",
      isGuest: true,
      userid: `guest_${Date.now()}`
    };

    // Store guest user data
    localStorage.setItem("user", JSON.stringify(guestUser));
    localStorage.setItem("token", `guest_token_${Date.now()}`);

    // Trigger login
    login({ credential: `guest_${Date.now()}` } as CredentialResponse);
  };

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []); // you can also add your client id as dependency here

    return <div ref={divRef} />;
  };

  return (
    <Box
      component="div"
      sx={{
        backgroundColor: '#FCFCFC'
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            <img src={yariga} alt="Yariga Logo" />
          </div>
          <Box mt={4}>
            <GoogleButton />
          </Box>
          <Box mt={2} display="flex" alignItems="center" width="100%">
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
              or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>
          <Box mt={2}>
            <Button
              variant="outlined"
              onClick={handleGuestLogin}
              sx={{
                minWidth: 200,
                py: 1.5,
                borderColor: 'grey.400',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.600',
                  backgroundColor: 'grey.50'
                }
              }}
            >
              Continue as Guest
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Guest users can browse properties but cannot save favorites or contact agents
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
