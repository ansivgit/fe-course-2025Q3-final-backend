export class DataRepository {
  public async getWidgetsByType(widgetType: string): Promise<unknown> {
    try {
      const imported: { default: unknown } = await import(`../../data/widgets/${widgetType}.json`);
      return imported.default;
    } catch {
      return null;
    }
  }
}
