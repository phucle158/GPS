import { useState } from "react";
import { getLocation } from "zmp-sdk/apis";
import { Box, Button, Icon, Page, Text } from "zmp-ui";

import Clock from "../components/clock";
import Logo from "../components/logo";
import bg from "../static/bg.svg";

function HomePage() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // ✅ Dùng OpenStreetMap Nominatim để lấy địa chỉ từ tọa độ
  const getAddressFromCoords = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const res = await fetch(url, {
      headers: {
        // Optional: thêm User-Agent để tránh bị chặn
        "User-Agent": "Zalo-MiniApp-Demo/1.0",
      },
    });

    const data = await res.json();

    if (data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error("Không thể lấy địa chỉ từ OpenStreetMap");
    }
  };

  const handleGetLocation = () => {
    getLocation({
      success: async (data) => {
        const { latitude, longitude } = data;
        setLocation({ latitude, longitude });

        try {
          const addr = await getAddressFromCoords(latitude, longitude);
          setAddress(addr);
          setError("");
        } catch (err) {
          setAddress("");
          setError("Lấy tọa độ được nhưng không truy ra địa chỉ.");
          console.error("Lỗi lấy địa chỉ:", err);
        }
      },
      fail: (err) => {
        console.error("Lỗi khi lấy vị trí:", err);
        setError("Không thể lấy vị trí.");
      },
    });
  };

  return (
    <Page
      className="flex flex-col items-center justify-center space-y-6 bg-cover bg-center bg-no-repeat bg-white dark:bg-black"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Box textAlign="center" className="space-y-1">
        <Text.Title size="xLarge">Định vị GPS Zalo Mini App</Text.Title>
        <Clock />
      </Box>

      <Button variant="primary" onClick={handleGetLocation}>
        Lấy vị trí & địa chỉ
      </Button>

      {location && (
        <Text className="mt-2 text-center font-medium">
          📍 Tọa độ: {location.latitude}, {location.longitude}
        </Text>
      )}

      {address && (
        <Text className="mt-2 text-center font-semibold text-green-600">
          🏠 Địa chỉ: {address}
        </Text>
      )}

      {error && <Text className="mt-2 text-red-500 text-center">{error}</Text>}

      <Logo className="fixed bottom-8" />
    </Page>
  );
}

export default HomePage;
