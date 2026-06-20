
package lista_compras_api;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
public class Grupo {
    String nome;

    @Id
    @GeneratedValue
    Long id;




    }
