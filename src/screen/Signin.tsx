import { useState } from "react";
import { Alert } from "react-native";
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import auth from "@react-native-firebase/auth";

import Logo from "../assets/logo_primary.svg";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSigning() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Informe email e senha");
    }

    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);

      if (error.code === "auth/invalid-email") {
        Alert.alert("Entrar", "Email ou senha inválida.");
      }

      if (error.code === "auth/user-not-found") {
        Alert.alert("Entrar", "Usuário não cadastrado.");
      }

      if (error.code === "auth/wrong-password") {
        Alert.alert("Entrar", "Email ou senha inválida.");
      }

      return Alert.alert("Entrar", "Não foi possível entrar");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        placeholder="Email"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        mb={8}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSigning}
        isLoading={isLoading}
      />
    </VStack>
  );
}
