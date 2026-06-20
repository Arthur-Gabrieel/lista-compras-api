package lista_compras_api;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private Long grupoId;

    // Construtor padrão exigido pelo JPA/Spring
    public Produto() {
    }

    public Produto(Long id, String nome, Long grupoId) {
        this.id = id;
        this.nome = nome;
        this.grupoId = grupoId;
    }

    // Getters e Setters para o Spring conseguir ler e escrever os dados
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Long getGrupoId() {
        return grupoId;
    }

    public void setGrupoId(Long grupoId) {
        this.grupoId = grupoId;
    }
}