import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 

export default function App() {
  const [mostrarInput, setMostrandoInput] = useState(false);
  const [nomeGrupo, setNomeGrupo] = useState('');
  const [grupos, setGrupos] = useState([]);

  // --- NOVOS ESTADOS PARA A TELA DE PRODUTOS ---
  const [grupoAtivo, setGrupoAtivo] = useState(null); // Guarda o grupo que está aberto
  const [mostrarModalProduto, setMostrarModalProduto] = useState(false); // Controla o Modal
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');

  // Função para criar um novo grupo (quadrado)
  const adicionarGrupo = () =>  {
    if (nomeGrupo.trim() === '') return;

    const novoGrupo = {
      id: Date.now().toString(),
      nome: nomeGrupo,
      produtos: [] // Cada grupo agora nasce com uma lista de produtos vazia
    };

    setGrupos([...grupos, novoGrupo]);
    setNomeGrupo('');
    setMostrandoInput(false);
  };

  // Função para deletar o grupo inteiro
  const deletarGrupo = (idGrupo) => {
    const listasFiltradas = grupos.filter(g => g.id !== idGrupo);
    setGrupos(listasFiltradas);
    setGrupoAtivo(null); // Volta para a tela inicial
  };

  // Função para adicionar um produto dentro do grupo aberto
  const adicionarProduto = () => {
    if (nomeProduto.trim() === '') return;

    const novoProduto = {
      id: Date.now().toString(),
      nome: nomeProduto,
      valor: valorProduto ? parseFloat(valorProduto.replace(',', '.')) : 0 // Converte o valor para número
    };

    // Atualiza o grupo específico adicionando o produto na lista dele
    const gruposAtualizados = grupos.map(g => {
      if (g.id === grupoAtivo.id) {
        return { ...g, produtos: [...g.produtos, novoProduto] };
      }
      return g;
    });

    setGrupos(gruposAtualizados);
    
    // Atualiza a tela atual com o produto novo
    const grupoComNovoProduto = gruposAtualizados.find(g => g.id === grupoAtivo.id);
    setGrupoAtivo(grupoComNovoProduto);

    // Limpa e fecha o Modal
    setNomeProduto('');
    setValorProduto('');
    setMostrarModalProduto(false);
  };

  // Função para deletar um produto específico
  const deletarProduto = (idProduto) => {
    const gruposAtualizados = grupos.map(g => {
      if (g.id === grupoAtivo.id) {
        const produtosFiltrados = g.produtos.filter(p => p.id !== idProduto);
        return { ...g, produtos: produtosFiltrados };
      }
      return g;
    });

    setGrupos(gruposAtualizados);
    const grupoAtualizado = gruposAtualizados.find(g => g.id === grupoAtivo.id);
    setGrupoAtivo(grupoAtualizado);
  };

  // --- RENDERIZAÇÃO DA TELA DE PRODUTOS (NOVA GUIA) ---
  if (grupoAtivo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Topo da Tela de Produtos */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setGrupoAtivo(null)}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{grupoAtivo.nome}</Text>
          
          <TouchableOpacity onPress={() => deletarGrupo(grupoAtivo.id)}>
            <Ionicons name="trash" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Lista de Produtos Adicionados */}
        <View style={styles.content}>
          {grupoAtivo.produtos.length === 0 ? (
            <Text style={styles.welcomeText}>Nenhum produto nesta lista ainda.</Text>
          ) : (
            <FlatList 
              data={grupoAtivo.produtos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.productRow}>
                  <View>
                    <Text style={styles.productName}>{item.nome}</Text>
                    <Text style={styles.productValue}>R$ {item.valor.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deletarProduto(item.id)}>
                    <Ionicons name="close-circle" size={24} color="#64748B" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Botão Flutuante de Mais para abrir o Modal de Produtos */}
        <TouchableOpacity style={styles.fab} onPress={() => setMostrarModalProduto(true)}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        {/* MODAL PARA ADICIONAR PRODUTO */}
        <Modal visible={mostrarModalProduto} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Adicionar Produto</Text>
              
              <TextInput 
                style={styles.modalInput}
                placeholder="Nome do produto (Ex: Arroz)"
                value={nomeProduto}
                onChangeText={setNomeProduto}
              />

              <TextInput 
                style={styles.modalInput}
                placeholder="Valor (Ex: 5.50)"
                keyboardType="numeric"
                value={valorProduto}
                onChangeText={setValorProduto}
              />

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setMostrarModalProduto(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={adicionarProduto}>
                  <Text style={styles.confirmButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // --- RENDERIZAÇÃO DA TELA PRINCIPAL (QUADRADOS) ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>Minhas Compras</Text>
        <TouchableOpacity onPress={() => setMostrandoInput(!mostrarInput)}>
          <Ionicons name={mostrarInput ? "close" : "add"} size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {mostrarInput && (
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Digite o nome do grupo..."
            placeholderTextColor="#94A3B8"
            value={nomeGrupo}
            onChangeText={setNomeGrupo}
          />
          <TouchableOpacity style={styles.saveButton} onPress={adicionarGrupo}>
            <Text style={styles.saveButtonText}>Criar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {grupos.length === 0 ? (
          <Text style={styles.welcomeText}>Nenhum grupo de compras criado ainda.</Text>
        ) : (
          <FlatList 
            data={grupos}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              // Ao clicar no Quadrado, define ele como o grupoAtivo para abrir a guia
              <TouchableOpacity style={styles.card} onPress={() => setGrupoAtivo(item)}>
                <Text style={styles.cardText}>{item.nome}</Text>
                <Text style={styles.cardItemsCount}>{item.produtos.length} itens</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    color: '#1E293B',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '47%',
    height: 120,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between', // Alinha o nome no topo e o contador embaixo
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  cardItemsCount: {
    fontSize: 13,
    color: '#64748B',
  },
  // --- ESTILOS EXCLUSIVOS DA TELA INTERNA DE PRODUTOS ---
  productRow: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  productValue: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: 'bold',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0EA5E9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Escurece o fundo atrás do modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#0EA5E9',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});