import { useState } from "react";
import { View, Text, Modal, TextInput, Pressable,StyleSheet } from "react-native";

interface props {
  wTime: number;
  bTime: number;
  setWTime: React.Dispatch<React.SetStateAction<number>>;
  setBTime: React.Dispatch<React.SetStateAction<number>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export default function UpdatesTimes({wTime,bTime,setWTime,setBTime,setTimeLeft}:props) {
    const [workTime, setWorkTime] = useState(wTime.toString());
    const [breakTime, setBreakTime] = useState(bTime.toString());
    const [modal, setModal] = useState(false);

    const handleUpdate = () => {
      // converir los valores de texto a numeros y actualizamos el estado
      // el fallo era porque no le agregaba al setTime left
      // tambien no guardaba hasta dar otro click en modificar, porque el handleUpdate lo habiia
      //puesto en el boton de abrir modal y no en el de guardar jajajaaaa
        setWTime(parseInt(workTime) * 60);
        setBTime(parseInt(breakTime) * 60);
        setTimeLeft(parseInt(workTime) * 60);
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    setModal(!modal);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>TRABAJO:</Text>
                        <TextInput style={styles.input} onChangeText={setWorkTime} value={workTime} keyboardType="numeric"/>
                        <Text style={styles.modalText}>RECESO:</Text>
                        <TextInput style={styles.input} onChangeText={ setBreakTime} value={breakTime} keyboardType="numeric"/>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={()=>{
                            setModal(!modal);
                            handleUpdate();
                        }}
                        >
                            <Text style={styles.textStyle}>GUARDAR</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable
            style={[styles.button, styles.buttonOpen]}
             onPress={()=>{
                setModal(true);
            }}>
                <Text style={styles.textStyle}>MODIFICAR</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 35,
        width:110,
        margin: 12,
        borderWidth: 1,
        borderRadius:10,
        padding: 10,
      },
    centeredView: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white', // buscar color
      borderRadius: 20,
      padding: 50,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: 'blue',
      margin:7,
      width: 140,
      height: 40,
    },
    buttonClose: {
      backgroundColor: 'blue',
    },
    textStyle: {
      color: 'white',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 8,
      textAlign: 'center',
    },
  });