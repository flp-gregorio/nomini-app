import { useForm } from "react-hook-form";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";

interface IFormInput {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit = (data: IFormInput) => {
    console.log(data);
  };

  return (
      <div className="flex justify-center min-h-[85vh]">
        <div className="bg-zinc-900 p-8 shadow-md max-w-xl w-full mx-auto my-2 overflow-visible">
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-white text-2xl mt-8 font-bold uppercase">
              Change Password
            </p>
            <div className="mt-4">
              <InputComponent
                label="CURRENT PASSWORD"
                type="password"
                placeholder=""
                {...register("password")}
              />
            </div>
            <div className="mt-4">
              <InputComponent
                label="NEW PASSWORD"
                type="password"
                placeholder=""
                {...register("newPassword")}
              />
            </div>
            <div className="mt-4">
              <InputComponent
                label="CONFIRM NEW PASSWORD"
                type="password"
                placeholder=""
                {...register("confirmPassword")}
              />
            </div>
            <div className="mt-6">
              <ButtonComponent text="SAVE CHANGES" type="submit" />
            </div>
          </form>
        </div>
      </div>
  );
};

export default Profile;
