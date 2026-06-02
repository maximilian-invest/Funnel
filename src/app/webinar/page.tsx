import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { WebinarRoom } from "@/components/WebinarRoom";

export const metadata: Metadata = {
  title: "ALLROUND.IMMO · Webinar-Raum",
};

export default function WebinarPage() {
  return (
    <div className="room">
      <Nav variant="room" />
      <div className="room-wrap">
        <div className="container">
          <WebinarRoom />
        </div>
      </div>
    </div>
  );
}
