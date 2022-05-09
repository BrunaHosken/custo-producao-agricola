import apollo, { onLogin } from "./../../../plugins/apollo";
import LoginMutation from "./../graphql/Login.gql";
import AgricultorQuery from "./../graphql/Agricultor.gql";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import updateAgricultor from "./../graphql/updateAgricultorSenhaRecuperada.gql";
const login = async (variables) => {
  const response = await apollo.mutate({
    mutation: LoginMutation,
    variables,
  });
  const { login } = response.data;
  await onLogin(apollo, login.token);
  return response.data.login;
};

const agricultor = (options = {}) => {
  const response = apollo.watchQuery({
    query: AgricultorQuery,
    ...options,
  });
  return from(response).pipe(map((res) => res.data.agricultor));
};

const UpdateAgricultor = async (variables) => {
  const response = await apollo.mutate({
    mutation: updateAgricultor,
    variables,
  });

  return response.data.resetPassword;
};

export default {
  login,
  agricultor,
  UpdateAgricultor,
};
