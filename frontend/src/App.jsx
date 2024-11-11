import FloatingShape from "./components/FloatingShape";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-amber-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-yellow-500"
        size="w-48 h-48"
        top="60%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-orange-400"
        size="w-32 h-32"
        top="40"
        left="0%"
        delay={3}
      />
    </div>
  );
}

export default App;
