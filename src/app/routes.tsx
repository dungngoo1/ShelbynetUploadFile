import { createBrowserRouter } from "react-router-dom";
import { App } from "@/app/App";
import { UploadPage } from "@/features/upload/pages/UploadPage";
import { VerifyPage } from "@/features/verify/pages/VerifyPage";
import { HistoryPage } from "@/features/history/pages/HistoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <UploadPage />,
      },
      {
        path: "verify",
        element: <VerifyPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
]);
