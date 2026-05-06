import { Icon } from "./components/Icon";

function App() {
  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 24,
        }}
      >
        <h1>Привеееет</h1>
        {/* .. */}
        {/* .. */}
        {/* .. */}
      </div>
      <div
        style={{
          height: 80,
          borderRadius: 32,
          // backgroundColor: "red",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingInline: 24,
        }}
      >
        <Icon name="cup" size={32} />
        <Icon name="qr-code" size={32} />
        <Icon name="basket" size={32} />
        <Icon name="profile" size={32} />
      </div>
    </>
  );
}

export default App;
