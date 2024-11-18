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

  it("Remove radio from favorites", async () => {
    const mockFavorites = [
      { name: "Radio 1", stationuuid: "123", favicon: "", country: "USA" },
    ];

    service.getRadios.mockResolvedValueOnce({ data: mockFavorites });

    render(<App />);

    const deleteIcon = screen.getByTestId("delete-icon");
    fireEvent.click(deleteIcon);

    const updatedFavorites = JSON.parse(localStorage.getItem("Favorites"));
    expect(updatedFavorites).toHaveLength(0);
  });
});
