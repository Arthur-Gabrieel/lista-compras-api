package lista_compras_api;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/grupos")
@CrossOrigin(origins = "*")
public class GrupoController {

    private final GrupoRepository repository;

    public GrupoController(GrupoRepository repository) {
        this.repository = repository;
    }

    // LISTAR TODOS
    @GetMapping
    public List<Grupo> listar() {
        return repository.findAll();
    }

    // CRIAR GRUPO
    @PostMapping
    public Grupo criar(@RequestBody Grupo grupo) {
        return repository.save(grupo);
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    public Grupo buscarPorId(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // DELETAR
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
