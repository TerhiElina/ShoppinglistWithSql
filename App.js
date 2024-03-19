import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList} from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite'

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [itemsOnList, setItemsOnList] = useState([]);

  const db = SQLite.openDatabase('listItems.db');

  useEffect(() =>{
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists listItems (id integer primary key autoincrement, product text not null, amount text);');
      },() => console.error("Error when creating DB"), updateList);
  }, []);

  const addToList = () =>{
    db.transaction(tx => {
      tx.executeSql('insert into listItems (product, amount) values (?, ?);',
        [product, amount]);
    }, null, updateList)
  }
  const updateList = () =>{
    db.transaction(tx => {
      tx.executeSql('select * from listItems', [], (_,{rows}) =>
      setItemsOnList(rows._array));
    }, null, null);
  }
  const deleteItem = (id) =>{
    db.transaction(tx => {
        tx.executeSql('delete from listItems where id = ?;', [id]);}, null, updateList)
    }
   


  return (
    <View style={styles.container}>
      <View style={styles.inputfields}>
        <TextInput
          style={styles.singleinput}
          placeholder='product'
          onChangeText={product => setProduct(product)}
          value={product}
        />
        <TextInput
          style={styles.singleinput}
          placeholder='amount'
          onChangeText={ amount => setAmount(amount)}
          value={amount}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
        title='add'
        onPress={addToList}
        />
      </View>
      <FlatList
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
          <View style={styles.listcontainer}>
            <Text style={{fontSize:20}}>{item.product}, {item.amount} </Text>
            <Text style={{color: '#0000ff', marginLeft: 20, fontSize: 20}} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
          data={itemsOnList}
          />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
    
    
  },
  inputfields: {
    marginTop: 50,
    marginLeft: 50,
    //alignItems: 'center',
    alignContent:'space-around',
    
  },
  singleinput:{
    borderWidth:1,
    borderColor: 'red',
    padding: 5,
    marginBottom: 10,
    marginRight: 50,

  },
  buttonContainer: {
    marginLeft: 50,
    marginRight: 80,
    marginBottom: 30,
    padding:5,

  },
  listcontainer:{
    marginTop: 10,
    flexDirection:'row',
  }
});
