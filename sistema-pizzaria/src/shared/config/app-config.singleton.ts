export class AppConfig {
  private static instance: AppConfig;

  readonly apiUrl = 'http://localhost:3000';
  readonly telefoneEstabelecimentoPadrao = '5585999999999';
  readonly nomeSistema = 'Sistema de Pedidos';

  private constructor() {}

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
}
