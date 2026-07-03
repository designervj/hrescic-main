import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import LocaleScript from "./LocaleScript";
import StoreProvider from "@/lib/store/StoreProvider";
import UpdateCurrentPage from "@/components/getallData/pageData/UpdateCurrentPage";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  const validLocale = locale === "hr" ? "hr" : "en";

  return (
    <>
      <StoreProvider>
        <LocaleScript locale={validLocale} />
        <Header locale={validLocale} />
        <UpdateCurrentPage/>
        {children}
        <Footer locale={validLocale} />
      </StoreProvider>
    </>
  );
}
