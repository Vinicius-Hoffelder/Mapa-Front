import axios from 'axios';

const API_URL = 'https://api-sample-pvco.onrender.com/auth';

function getApiErrorMessage(error, fallbackMessage) {
  const responseMessage = error.response?.data?.message || error.response?.data?.error;

  if (responseMessage) {
    return responseMessage;
  }

  if (error.response?.status >= 500) {
    return 'Erro no servidor. Tente novamente em alguns instantes.';
  }

  if (error.request && !error.response) {
    return 'Nao foi possivel conectar ao servidor.';
  }

  return fallbackMessage;
}

export async function signIn(email, password) {
  try {
    const response = await axios.post(`${API_URL}/signin`, {
      email: email.trim(),
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Requisição inválida.');
      }
      if (error.response.status === 401) {
        throw new Error('Usuário ou senha incorretos.');
      }
    }
    throw new Error(getApiErrorMessage(error, 'Erro ao autenticar.'));
  }
}

export async function signUp(name, email, password) {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name: name.trim(),
      email: email.trim(),
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Dados invalidos ou email ja cadastrado.');
      }
      if (error.response.status === 409) {
        throw new Error('Usuario ja cadastrado.');
      }
    }
    throw new Error(getApiErrorMessage(error, 'Erro ao cadastrar usuario.'));
  }
}
