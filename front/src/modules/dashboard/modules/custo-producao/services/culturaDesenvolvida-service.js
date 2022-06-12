import apollo from "../../../../../plugins/apollo";
import culturaDesenvolvidaQuery from "./../graphql/CulturaDesenvolvida.gql";
import culturaEtapaQuery from "./../graphql/CulturaEtapa.gql";
import createCulturaDesenvolvida from "./../graphql/createCulturaDesenvolvida.gql";
import deleteCulturaDesenvolvida from "./../graphql/deleteCulturaDesenvolvida.gql";
import usoInsumoPrevistoQuery from "./../graphql/UsoInsumoPrevisto.gql";
import usoInsumoRealQuery from "./../graphql/UsoInsumoReal.gql";
import servicoPrevistoQuery from "./../graphql/ServicoPrestado.gql";
import servicoPrestadoQuery from "./../graphql/ServicoPrevisto.gql.gql";

const culturaDesenvolvida = async (variables) => {
  const response = await apollo.mutate({
    mutation: culturaDesenvolvidaQuery,
    variables,
  });
  return response.data.culturaDesenvolvidas;
};
const culturaEtapa = async (variables) => {
  const response = await apollo.mutate({
    mutation: culturaEtapaQuery,
    variables,
  });
  return response.data.culturaEtapas;
};
const usoInsumoPrevisto = async (variables) => {
  const response = await apollo.mutate({
    mutation: usoInsumoPrevistoQuery,
    variables,
  });
  return response.data.usoInsumoPrevistoes;
};
const usoInsumoReal = async (variables) => {
  const response = await apollo.mutate({
    mutation: usoInsumoRealQuery,
    variables,
  });
  return response.data.usoInsumoReals;
};
const servicoPrevisto = async (variables) => {
  const response = await apollo.mutate({
    mutation: servicoPrevistoQuery,
    variables,
  });

  return response.data.servicoPrestadoes;
};
const servicoPrestado = async (variables) => {
  const response = await apollo.mutate({
    mutation: servicoPrestadoQuery,
    variables,
  });

  return response.data.servicoPrevistoes;
};

const CreateCulturaDesenvolvida = async (variables) => {
  variables.quantidade = parseFloat(variables.quantidade);
  variables.terreno = parseFloat(variables.terreno);
  variables.culturaDescricaoId = variables.culturaDescricao.id;

  const response = await apollo.mutate({
    mutation: createCulturaDesenvolvida,
    variables,
  });
  return response.data.createCulturaDesenvolvida;
};

const DeleteCulturaDesenvolvida = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteCulturaDesenvolvida,
    variables,
  });
  return response.data.deleteCulturaDesenvolvida;
};

export default {
  culturaDesenvolvida,
  culturaEtapa,
  CreateCulturaDesenvolvida,
  DeleteCulturaDesenvolvida,
  servicoPrestado,
  servicoPrevisto,
  usoInsumoPrevisto,
  usoInsumoReal,
};
