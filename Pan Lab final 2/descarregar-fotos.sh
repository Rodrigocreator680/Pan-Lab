#!/bin/sh
# Descarrega as fotos das receitas (Unsplash) para a pasta imagens/
cd "$(dirname "$0")" || exit 1
mkdir -p imagens
while IFS="|" read -r ficheiro endereco; do
  [ -z "$endereco" ] && continue
  if curl -fsSL -o "$ficheiro" "$endereco"; then echo "OK      $ficheiro"; else echo "FALHOU  $ficheiro"; rm -f "$ficheiro"; fi
done < fotos-lista.txt
echo "Concluido."
