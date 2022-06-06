import apollo from "../../../../../plugins/apollo";
import culturaDesenvolvidaQuery from "./../graphql/CulturaDesenvolvida.gql";
import culturaEtapaQuery from "./../graphql/CulturaEtapa.gql";
import createCulturaDesenvolvida from "./../graphql/createCulturaDesenvolvida.gql";

const culturaDesenvolvida = async (variables) => {
  const response = await apollo.mutate({
    mutation: culturaDesenvolvidaQuery,
    variables,
  });
  return response.data.culturaDesenvolvidas;
};
const culturaEtapa = async (variables) => {
  variables.id = variables[0].id;
  variables.splice(variables[0].id);
  const response = await apollo.mutate({
    mutation: culturaEtapaQuery,
    variables,
  });
  return response.data.culturaEtapas;
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

export default {
  culturaDesenvolvida,
  culturaEtapa,
  CreateCulturaDesenvolvida,
};
