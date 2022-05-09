import apollo from "../../../../../plugins/apollo";
import updateAgricultor from "./../graphql/updateAgricultor.gql";
import deleteAgricultor from "./../graphql/deleteAgricultor.gql";

const DeleteAgricultor = async (variables) => {
  const response = await apollo.mutate({
    mutation: deleteAgricultor,
    variables,
  });
  return response;
};

const UpdateAgricultor = async (variables) => {
  const response = await apollo.mutate({
    mutation: updateAgricultor,
    variables,
  });

  return response.data.updateAgricultor;
};

export default {
  UpdateAgricultor,
  DeleteAgricultor,
};
