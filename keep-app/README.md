# Keep

App de gerenciamento de despensa doméstica/comercial com controle de validade, alertas, receitas, lista de compras e relatórios de perda.

## Stack

- Expo SDK 57 / React Native 0.86 / React 19
- React Navigation v7 (native-stack + bottom-tabs)
- expo-camera (scanner de código de barras)
- expo-linear-gradient
- @react-native-async-storage/async-storage
- @expo-google-fonts/nunito

## Como rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o app Expo Go (Android/iOS), ou pressione `a` / `i` no terminal para abrir em emulador/simulador. Para rodar no navegador, pressione `w`.

Ao abrir pela primeira vez no dispositivo, autorize a permissão de câmera para poder usar o scanner de código de barras (tela **Escanear código**).

## Estrutura do projeto

```
src/
  theme/           paleta de cores, tipografia (Nunito) e espaçamentos
  services/        camada de dados (config.js define mock vs API real)
    mock/          dados fake usados enquanto USE_MOCK = true
  context/         AuthContext e PantryContext
  components/      componentes reutilizáveis (Button, Input, ProductCard, etc.)
  screens/         telas organizadas por domínio (Auth, Pantry, Lists, Recipes, Reports, Settings)
  navigation/       stacks e tab navigator
utils/date.js      helpers de data e status de validade
```

## Como plugar o backend real

Toda a app consome dados através dos arquivos em `src/services/*Service.js` (nunca diretamente dos mocks). Para conectar ao backend real, edite **apenas** `src/services/config.js`:

```js
export const USE_MOCK = false; // era true
export const API_BASE_URL = 'https://sua-api-real.com/v1';
```

Cada função dos services (`productsService`, `reportsService`, `recipesService`, `listsService`, `authService`, `plansService`) já checa `USE_MOCK` internamente e, quando `false`, chama `apiFetch(path, options)` — que já injeta o `API_BASE_URL` e o header `Content-Type: application/json`. A assinatura de cada função (parâmetros e retorno) é idêntica nos dois modos, então nenhuma tela precisa ser alterada.

Se o backend exigir autenticação via token, adicione o header de `Authorization` dentro de `apiFetch` em `src/services/config.js`, lendo o token salvo pelo `AuthContext` (chave `@keep:user` no AsyncStorage, ou ajuste para salvar o token separadamente).

## Fluxo de autenticação

`RootNavigator` decide entre `AuthStack` (Splash → Welcome → Login/SignUp/ForgotPassword) e `MainTabs` (as 5 abas) com base em `AuthContext.isAuthenticated`. O logout está disponível na aba **Conta**.

## Notas de produto

- A tela de Listas é uma checklist estruturada (item + quantidade + checkbox), não um editor de texto livre.
- Produto vencido só permite "Descartar e registrar perda"; produto válido tem stepper de quantidade normal.
- Cadastro de produto passa por uma tela de escolha (`AddProductChoice`): Escanear código ou Registrar manualmente.
- Relatórios usam um gráfico de barras feito com `View`s nativas (sem lib externa), alimentado por `reportsService.getSummary()`.
