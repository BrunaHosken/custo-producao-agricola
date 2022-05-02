import TipoInsumo from "./../graphql/TipoInsumos.gql";
import apollo from "../../../../../plugins/apollo";

const tipoInsumos = async (options = {}) => {
  const response = await apollo.query({
    query: TipoInsumo,
    ...options,
  });
  return response.data.tipoInsumoes;
};

export default { tipoInsumos };
