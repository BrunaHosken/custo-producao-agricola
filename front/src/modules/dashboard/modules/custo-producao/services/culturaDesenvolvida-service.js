import apollo from "../../../../../plugins/apollo";
import culturaDesenvolvidaQuery from "./../graphql/CulturaProduzida.gql";
import culturaEtapaQuery from "./../graphql/CulturaEtapa.gql";

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

export default {
  culturaDesenvolvida,
  culturaEtapa,
};
