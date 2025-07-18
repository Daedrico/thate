# thate

<!-- toc -->

- [🎯 Purpose](#%F0%9F%8E%AF-purpose)
- [🚀 Features](#%F0%9F%9A%80-features)
- [📦 Installation](#%F0%9F%93%A6-installation)
- [🛠️ Usage](#%F0%9F%9B%A0%EF%B8%8F-usage)
  * [Convert STF to Excel](#convert-stf-to-excel)
  * [Convert Excel to STF](#convert-excel-to-stf)
- [🛠 Configuration File: `.thate.json`](#%F0%9F%9B%A0-configuration-file-thatejson)
  * [📄 Example `.thate.json`](#%F0%9F%93%84-example-thatejson)
- [📝 License](#%F0%9F%93%9D-license)

<!-- tocstop -->

**thate** is a command-line application built with **Node.js** to simplify the handling of translation files in Salesforce projects.

## 🎯 Purpose

I created **thate** — short for "**translation hate**" — because I've always hated how tedious and error-prone Salesforce translation file management can be. This tool was born out of frustration with the `.stf` format and the manual work it often requires, especially when clients only work with `.xlsx` files.

The tool allows you to convert `.stf` (Salesforce Translation Files) into `.xlsx` files and vice versa. It currently supports **bilingual** formats — files with one source and one target language.

This helps reduce manual effort, as clients are usually provided with `.xlsx` files for translation, while `.stf` files are used within Salesforce for importing and exporting translations.

## 🚀 Features

- ✅ Convert `.stf` files to `.xlsx`
- ✅ Convert `.xlsx` files back to `.stf`
- ✅ Support for bilingual translation files
- ✅ Streamlines the localization process in Salesforce projects

## 📦 Installation

Install globally using npm:

```bash
npm install -g thate
```

Or locally within your project:

```bash
npm install thate
```

## 🛠️ Usage

**thate** will convert all files in source folders

### Convert STF to Excel

```bash
thate excel
```

### Convert Excel to STF

```bash
thate stf
```

## 🛠 Configuration File: `.thate.json`

To customize how `thate` works within your project, you can create a configuration file named `.thate.json` in the **root directory** of your project.

This file allows you to specify default paths for input/output and define rules for filtering out unwanted translations during processing.

### 📄 Example `.thate.json`

```json
{
  "outputStf": "utils/translations/output-stf",
  "outputStfRevised": "utils/translations/source-stf-revised",
  "outputXlsx": "utils/translations/output-xlsx",
  "sourceStf": "utils/translations/source-stf",
  "sourceXlsxTranslated": "utils/translations/translated-xlsx",
  "stuffToRemove": [
    ".Google",
    "ActionPlanTemplateItem.",
    "CustomApp.Sales",
    "PicklistValue.Standard.opportunityStage"
  ]
}
```

## 📝 License

MIT License
