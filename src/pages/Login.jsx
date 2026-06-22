import React, { useState } from "react";
import { Title, Input, Button } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import logoImg from "../assets/logo.png";
import illustrationImg from "../assets/login-illustration.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const token = await signIn(email, senha);
      login(token);
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <div>
          <img
            src={logoImg}
            alt="ParticipaAi"
            className="w-35 h-auto"
          />
        </div>

        <div className="pt-0 pb-0">
          <Title title="Bem Vindo de volta!" />
        </div>

        <div className="flex justify-center pb-6">
          <img
            src={illustrationImg}
            alt="Ilustração de login"
            className="w-45 h-auto"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <Input
              label="Email"
              placeholder="Digite seu email..."
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pb-4">
            <Input
              label="Senha"
              placeholder="Digite sua senha..."
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <div className="text-center pt-4">
            <Button type="submit">Acessar</Button>
          </div>
        </form>

        <div className="text-center pt-8">
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Faça seu cadastro
          </Link>
        </div>
      </div>
    </>
  );
}