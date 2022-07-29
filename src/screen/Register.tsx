import { useState } from "react";
import { VStack } from "native-base";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigation();

  async function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert("Registrar", "Insira todos os dados da ordem!");
    }

    try {
      setIsLoading(true);
      await firestore().collection("orders").add({
        patrimony,
        description,
        status: "open",
        create_at: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert("Registrar", "Solicitação criada com sucesso!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Registrar", "Não foi possível criar a solicitação.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação"></Header>

      <Input placeholder="Número do patrimônio" mt={4} onChangeText={setPatrimony} />
      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button title="Cadastrar" mt={5} isLoading={isLoading} onPress={handleNewOrderRegister}/>
    </VStack>
  );
}
