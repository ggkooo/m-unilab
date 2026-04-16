import { StyleSheet, Text, View } from 'react-native';

export function GetTicketHero() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retire aqui sua senha</Text>
      <Text style={styles.subtitle}>
        Selecione uma opcao abaixo para iniciar seu atendimento de forma rapida.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffee',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 24,
    color: '#475569',
    maxWidth: 760,
  },
});
