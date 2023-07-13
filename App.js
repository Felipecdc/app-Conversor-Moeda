import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';

import Selection from './src/Component/Selection';
import api from './src/services';

export default function App() {

  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selecionarMoeda, setSelecionarMoeda] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0);


  useEffect(() => {
    async function LoadingMoedas(){
      const response = await api.get('all');

      let arrayMoedas = []

      Object.keys(response.data).map((key)=>{
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })
      
      setMoedas(arrayMoedas);
    }
    LoadingMoedas();
    setLoading(false);
  }, [])


  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorFinal, setValorFinal] = useState(0);


  async function converter(){
    if(selecionarMoeda === null || moedaBValor === 0){
      alert('Por favor, selecione uma moeda!')
      return;
    }

    const response = await api.get(`all/${selecionarMoeda}-BRL`);
    //console.log(response.data[selecionarMoeda].ask)

    let resultado = (response.data[selecionarMoeda].ask * parseFloat(moedaBValor))

    setValorFinal(`R$ ${resultado.toFixed(2)}`);
    setValorMoeda(moedaBValor)  

    Keyboard.dismiss();

  }

if(loading){
  return(
    <View style={{justifyContent:'center', alignItems: 'center', flex: 1}}>
      <ActivityIndicator color="#fff" size={45}z/>
    </View>
  )
}else{
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda</Text>
        <Selection moedas={moedas} onChange={setSelecionarMoeda} valor={selecionarMoeda} />
      </View>

      <View style={styles.areaValor}>
        <Text>Digite um valor para converter em R$</Text>
        <TextInput
        placeholder='Ex: 127'
        style={styles.input}
        keyboardType='numeric'
        onChangeText={ (valor) => setMoedaBValor(valor)}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={converter}>
        <Text style={styles.botaoText}>Converter</Text>
      </TouchableOpacity>

      {valorFinal !== 0 && (
      <View style={styles.resultado}>
        <Text style={styles.valorConvertido}>{valorMoeda} {selecionarMoeda}</Text>
        <Text style={[styles.valorConvertido, {fontSize: 18, margin: 10}]}>Corresponde a</Text>
        <Text style={styles.valorConvertido}>{valorFinal}</Text>
      </View>
      )}

    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  areaMoeda:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1,
  },
  titulo:{
    fontSize: 15,
    color: '#000',
    paddingTop: 5,
    paddingLeft: 5,
  },
  areaValor:{
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingBottom: 9,
    paddingTop: 9,

  },
  input:{
    width: '100%',
    padding: 10,
    height: 45,
    fontSize:20,
    marginTop: 8,
    color: '#000'
  },
  botao:{
    width: '90%',
    backgroundColor: '#fb4b57',
    height: 45,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    justifyContent: 'center',
  },
  botaoText:{
    textAlign: 'center',
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold'
  },
  resultado:{
    width: '90%',
    backgroundColor: '#c9c9c9',
    marginTop: 35,
    alignItems: 'center',
    justifyContent:'center',
    padding: 25
  },
  valorConvertido:{
    fontSize: 39,
    fontWeight: 'bold',
    color: '#000'
  }
});
