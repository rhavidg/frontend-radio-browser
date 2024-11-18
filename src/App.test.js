import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";
import service from "./services/service";

jest.mock("./services/service", () => ({
  getRadios: jest.fn(),
  getRadiosByParam: jest.fn(),
}));

describe("App Component", () => {
  it("Add radio to favorites", async () => {
    const mockRadios = [
      {
        name: "Radio 1",
        country: "Country 1",
        favicon: "url1",
        stationuuid: "uuid1",
      },
    ];
    service.getRadios.mockResolvedValueOnce({ data: mockRadios });

    render(<App />);

    const radioItem = await screen.findByText("Radio 1");
    fireEvent.click(radioItem);
    await act(async () => {});
    const favorites = JSON.parse(localStorage.getItem("Favorites") || "[]");
    expect(favorites).toContainEqual(
      expect.objectContaining({ stationuuid: "uuid1" })
    );
  });
});
