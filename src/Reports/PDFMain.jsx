// PDFGenerator.jsx
import React from "react";
import {
  Document,
  Page,
  PDFViewer,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 8,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 8,
  },
});

const PDFGenerator = ({ selectedDate }) => {
  const lastMonthDate = format(
    subMonths(new Date(selectedDate), 1),
    "yyyy-MM-dd"
  );
  const startDate = format(startOfMonth(new Date(lastMonthDate)), "yyyy-MM-dd");
  const endDate = format(endOfMonth(new Date(lastMonthDate)), "yyyy-MM-dd");

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>
            Monthly Report for Last Month ({lastMonthDate})
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Category</Text>
              <Text style={styles.tableColHeader}>Value</Text>
            </View>
            {/* Replace with actual data */}
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>Category 1</Text>
              <Text style={styles.tableCol}>100</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFGenerator;
