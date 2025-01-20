import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import FooterCredits from "./FooterCredits";

const Footer = () => {
  return (
    <footer className="d-flex flex-sm-row justify-content-sm-between gap-sm-0 flex-column gap-2 justify-content-center align-items-center py-3 border-top">
      <FooterCredits />
      <ul className="nav list-unstyled d-flex gap-3">
        <li>
          <a href="#">
            <FaTwitter size={24} />
          </a>
        </li>
        <li>
          <a href="#">
            <FaInstagram size={24} />
          </a>
        </li>
        <li>
          <a href="#">
            <FaFacebook size={24} />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
