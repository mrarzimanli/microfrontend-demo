import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test/test-utils";
import { SettingsPage } from "@/pages/SettingsPage";
import { getProfile, updateProfile } from "@/services/profile.api";
import { MOCK_PROFILE } from "@/data/profile";

vi.mock("@/services/profile.api");

const mockGetProfile = vi.mocked(getProfile);
const mockUpdateProfile = vi.mocked(updateProfile);

describe("SettingsPage", () => {
    beforeEach(() => {
        mockGetProfile.mockResolvedValue({ ...MOCK_PROFILE });
        mockUpdateProfile.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("loading state", () => {
        it("renders the page header while the profile is loading", () => {
            mockGetProfile.mockImplementation(() => new Promise(() => {}));

            renderWithProviders(<SettingsPage basePath="/account" />);

            expect(screen.getByText("Account settings")).toBeInTheDocument();
        });

        it("does not render form fields while the profile is loading", () => {
            mockGetProfile.mockImplementation(() => new Promise(() => {}));

            renderWithProviders(<SettingsPage basePath="/account" />);

            expect(screen.queryByRole("textbox", { name: /full name/i })).not.toBeInTheDocument();
        });
    });

    describe("form hydration", () => {
        it("populates the Full Name field with the profile data", async () => {
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => {
                expect(screen.getByDisplayValue(MOCK_PROFILE.fullName)).toBeInTheDocument();
            });
        });

        it("populates the Email field with the profile data", async () => {
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => {
                expect(screen.getByDisplayValue(MOCK_PROFILE.email)).toBeInTheDocument();
            });
        });

        it("shows 'No unsaved changes.' before the user edits anything", async () => {
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            expect(screen.getByText("No unsaved changes.")).toBeInTheDocument();
        });
    });

    describe("dirty state", () => {
        it("Reset button is disabled when the form matches the loaded profile", async () => {
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
        });

        it("Reset button becomes enabled after editing a field", async () => {
            const user = userEvent.setup();
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
            await user.clear(fullNameInput);
            await user.type(fullNameInput, "New Valid Name");

            expect(screen.getByRole("button", { name: /reset/i })).not.toBeDisabled();
        });

        it("shows 'You have unsaved changes.' after editing a field", async () => {
            const user = userEvent.setup();
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
            await user.clear(fullNameInput);
            await user.type(fullNameInput, "New Valid Name");

            expect(screen.getByText("You have unsaved changes.")).toBeInTheDocument();
        });
    });

    describe("client-side validation", () => {
        it("shows a validation error for a full name that is too short", async () => {
            const user = userEvent.setup();
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            const input = screen.getByRole("textbox", { name: /full name/i });
            await user.clear(input);
            await user.type(input, "A");
            await user.tab(); // blur triggers onTouched validation

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(/at least 2 characters/i);
            });
        });

        it("shows a validation error for a malformed email address", async () => {
            const user = userEvent.setup();
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.email));

            const emailInput = screen.getByRole("textbox", { name: /email address/i });
            await user.clear(emailInput);
            await user.type(emailInput, "not-a-valid-email");
            await user.tab();

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(/valid email/i);
            });
        });
    });

    describe("successful submission", () => {
        it("shows the success alert after saving valid changes", async () => {
            const user = userEvent.setup();
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
            await user.clear(fullNameInput);
            await user.type(fullNameInput, "New Valid Name");

            await user.click(screen.getByRole("button", { name: /save changes/i }));

            await waitFor(() => {
                expect(screen.getByText("Settings saved!")).toBeInTheDocument();
            });
        });

        it("calls updateProfile with the submitted form data", async () => {
            const user = userEvent.setup();
            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.fullName));

            const fullNameInput = screen.getByRole("textbox", { name: /full name/i });
            await user.clear(fullNameInput);
            await user.type(fullNameInput, "Updated Name");

            await user.click(screen.getByRole("button", { name: /save changes/i }));

            await waitFor(() => {
                expect(mockUpdateProfile).toHaveBeenCalledWith(expect.objectContaining({ fullName: "Updated Name" }));
            });
        });
    });

    describe("server validation errors", () => {
        it("maps a server email conflict error onto the email form field", async () => {
            const user = userEvent.setup();
            mockUpdateProfile.mockResolvedValue({
                success: false,
                serverError: {
                    field: "email",
                    message: "This email address is already in use by another account.",
                },
            });

            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.email));

            const emailInput = screen.getByRole("textbox", { name: /email address/i });
            await user.clear(emailInput);
            await user.type(emailInput, "taken@example.com");

            await user.click(screen.getByRole("button", { name: /save changes/i }));

            await waitFor(() => {
                expect(
                    screen.getByText("This email address is already in use by another account."),
                ).toBeInTheDocument();
            });
        });

        it("does not show a success alert when the server returns a validation error", async () => {
            const user = userEvent.setup();
            mockUpdateProfile.mockResolvedValue({
                success: false,
                serverError: { field: "email", message: "Email conflict." },
            });

            renderWithProviders(<SettingsPage basePath="/account" />);

            await waitFor(() => screen.getByDisplayValue(MOCK_PROFILE.email));

            const emailInput = screen.getByRole("textbox", { name: /email address/i });
            await user.clear(emailInput);
            await user.type(emailInput, "taken@example.com");

            await user.click(screen.getByRole("button", { name: /save changes/i }));

            await waitFor(() => screen.getByText("Email conflict."));

            expect(screen.queryByText("Settings saved!")).not.toBeInTheDocument();
        });
    });
});
