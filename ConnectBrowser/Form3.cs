using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace ConnectBrowser
{
    public partial class Form3 : Form
    {
        public ChromiumWebBrowser browser;
        public Form3()
        {
            InitializeComponent();
            InitBrowser();
        }
        public void InitBrowser()
        {
            CefSettings cefSettings = new CefSettings();
            Cef.Initialize(cefSettings);
            browser = new ChromiumWebBrowser("https://abcnews.go.com/");
            this.panel1.Controls.Add(browser);
            browser.Dock = DockStyle.Fill;
        }
    }
}
