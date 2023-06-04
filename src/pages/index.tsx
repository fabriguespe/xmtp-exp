import BottomNav from "@/components/BottomNav";
import Home from "@/components/Home";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export default function Index() {
  return (
    <ThirdwebProvider activeChain="goerli">
      <Home />
      <BottomNav />
    </ThirdwebProvider>
  );
}
