import { useRef, useState } from "react";
import type { NextPage } from "next";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setUser } from "../../store/slices/user";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UpdateSchema from "../../validations/update";

import styles from "../../styles/pages/settings.module.scss";
import {
  FormControl,
  Input,
  Button,
  Flex,
  Image,
  FormErrorMessage,
} from "@chakra-ui/react";

import axios from "axios";


const Settings: NextPage = () => {
  const user = useAppSelector((state) => state.user);
  const [avatar, setAvatar] = useState<string>(
    user.avatar ?? "/images/default_user.png"
  );
  const avatarRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const selectImage = (e: any) => {
    setAvatar(URL.createObjectURL(e.target!.files[0]));
    e.target;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UpdateSchema),
  });

  async function submit(values: any) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("tag", values.tag);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("newPassword", values.newPassword);
    if (avatarRef.current?.files[0]) {
      formData.append("avatar", avatarRef.current?.files[0]);
    }

    const response = await axios.post("/api/settings/updateUser", formData);

    if (response.status === 200) {
      dispatch(setUser(response.data.user_data));
    }
  }

  return (
    <Flex id={styles.container}>
      <Flex>
        <label htmlFor="avatar">
          <Image
            id={styles.avatar}
            src={avatar}
            key={avatar}
            width={200}
            height={200}
            my="30px"
            alt="Avatar"
          />
        </label>
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          hidden
          id="avatar"
          name="avatar"
          onChange={selectImage}
        />

        <FormControl isInvalid={!!errors?.name?.message}>
          <Input
            variant="outline"
            placeholder="Enter your display name..."
            defaultValue={user.name}
            {...register("name")}
          />
          <FormErrorMessage mb={2}>{errors?.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.tag?.message}>
          <Input
            mt={4}
            variant="outline"
            placeholder="Enter your tag..."
            defaultValue={user.tag}
            {...register("tag")}
          />
          <FormErrorMessage mb={2}>{errors?.tag?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.email?.message}>
          <Input
            mt={4}
            variant="outline"
            type="email"
            placeholder="Enter your email..."
            defaultValue={user.email}
            {...register("email")}
          />
          <FormErrorMessage mb={2}>{errors?.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.password?.message}>
          <Input
            mt={4}
            variant="outline"
            type="password"
            placeholder="Enter your old password..."
            {...register("password")}
          />
          <FormErrorMessage mb={2}>
            {errors?.password?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors?.password?.message}>
          <Input
            mt={4}
            variant="outline"
            type="password"
            placeholder="Enter your new password..."
            {...register("newPassword")}
          />
          <FormErrorMessage mb={2}>
            {errors?.newPassword?.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          variant="primary"
          colorScheme="teal"
          my={7}
          w="50%"
          onClick={handleSubmit(submit)}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
};

export default Settings;
