# Experiência de mapa e infográfico — HealthData Brasil

## Identidade visual

- `frontend/public/healthdata-logo-lockup.webp`: assinatura horizontal completa usada na autenticação e nos metadados de compartilhamento.
- `frontend/public/healthdata-logo-mark.webp`: símbolo usado no cabeçalho e nos estados vazios.
- `frontend/public/favicon.svg`: ícone do navegador.
- A marca é uma identidade própria do HealthData Brasil inspirada na linguagem visual de saúde pública; não é uma reprodução nem uma marca oficial do SUS.

## Mapa de inteligência em saúde

A página `/mapa` mantém as consultas reais do CNES e oferece uma área cartográfica ampliada. A busca filtra os estabelecimentos presentes na página consultada por nome, município, UF, tipo ou código CNES. Os indicadores separam estabelecimentos com coordenadas válidas, total de registros retornados e registros sem coordenadas.

A cartografia utiliza Leaflet e OpenStreetMap, sem chave externa. As malhas de estados e municípios são obtidas da API oficial do IBGE.

Os marcadores são criados exclusivamente a partir de latitude/longitude existentes nos registros da consulta atual. O modo de concentração representa a distribuição das unidades georreferenciadas, não prevalência ou incidência de doenças. O modo 3D limita a amostra a 250 pontos para preservar desempenho.

## Infográfico

A rota `/analises` apresenta uma visualização interativa construída a partir da fonte selecionada e da resposta da API. Inclui:

- filtros básicos e avançados derivados do esquema publicado pela fonte;
- indicadores calculados somente sobre os registros recebidos;
- distribuição por UF, série temporal e composição, quando os campos existem;
- destaque do maior valor territorial e da categoria principal;
- tabela de origem, exportação CSV e impressão/salvamento em PDF pelo navegador;
- indicação da fonte, competência, horário de consulta, cache e regras de privacidade.

Se a fonte não trouxer campos para uma visualização, o painel informa a indisponibilidade em vez de criar dados de demonstração. A contagem de linhas é a contagem da página retornada; não deve ser interpretada como total nacional.

## Validação

Executar na raiz do projeto:

```bash
npm install
npm run check
npm test
npm run build
```

A autenticação com Google é realizada pelo Supabase Auth; consulte `DEPLOY-VERCEL.md` para configurar o provedor OAuth e os endereços de redirecionamento.
