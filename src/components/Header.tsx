import { Header, HeaderItem, AuthProvider } from "@hex-labs/core";

const HackGTHeader = () => {
  return (
    <Header
      rightItem={<HeaderItem>Sign Out</HeaderItem>}
      rightItemMobile={<HeaderItem>Sign Out</HeaderItem>}
    >
      <HeaderItem>Home</HeaderItem>
      <HeaderItem>Profile</HeaderItem>
    </Header>
  );
};

export default HackGTHeader;
