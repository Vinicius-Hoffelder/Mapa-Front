import "./logo.css";
import logoImg from "../../assets/logo.png";

export const Logo = () => {
  return (
    <div className="logo">
      <img src={logoImg} alt="Logotipo" className="logo-img" />
    </div>
  );
};