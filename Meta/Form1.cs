using ConnectBrowser;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Meta4
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void StartButton1_MouseDown(object sender, MouseEventArgs e)
        {
            StartButton1.Image = Properties.Resources.startButton2;
        }

        private void StartButton1_MouseUp(object sender, MouseEventArgs e)
        {
            StartButton1.Image = Properties.Resources.start_button;
        }

        private void StartButton1_Click(object sender, EventArgs e)
        {
            Form2 form2 = new Form2();
            form2.Show();
        }
    }
}
