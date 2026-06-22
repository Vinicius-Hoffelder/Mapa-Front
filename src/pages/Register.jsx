import React, { useState } from "react";
import { Title, Input, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
import logoImg from "../assets/logo.png";
import registerIllustrationImg from "../assets/register-illustration.png";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName || !trimmedEmail || !senha) {
        setErro("Preencha todos os campos.");
        return;
      }

      await signUp(trimmedName, trimmedEmail, senha);
      navigate("/login");
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
          <Title title="Faça seu cadastro" />
        </div>

        <div className="flex justify-center pb-6">
          <img
            src={registerIllustrationImg}
            alt="Ilustração de cadastro"
            className="w-50 h-auto"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <Input
              label="Nome"
              placeholder="Digite seu nome..."
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>

        <div className="text-center pt-8">
          <Link to="/login" className="text-blue-600 hover:underline">
            Já tem cadastro? <strong>Faça Login</strong>
          </Link>
        </div>
      </div>
    </>
  );
}
