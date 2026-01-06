import { useEffect, useState } from "react";
import axios from "axios";
import defaultLogo from "@/assets/clientLogo.png"; // your default logo
import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "../api/api";



function CompanyLogo() {
  const { employeeId, userType } = useParams();
  const [logoUrl, setLogoUrl] = useState(defaultLogo);

  useEffect(() => {
    if (!employeeId || !userType) return;

    axios
      .get(`/api/superuser/logo`, {
        params: { employeeId, userType },
        responseType: "blob",
      })
      .then((res) => {
        if (res.data && res.data.size > 0) {
          const url = URL.createObjectURL(res.data);
          setLogoUrl(url);
        } else {
          setLogoUrl(defaultLogo);
        }
      })
      .catch(() => setLogoUrl(defaultLogo));
  }, [employeeId, userType]);

  return <img src={logoUrl} alt="Company Logo" style={{ height: "50px", width: "auto" }} />;
}

export default CompanyLogo;
