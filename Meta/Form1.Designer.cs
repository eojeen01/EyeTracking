
namespace Meta4
{
    partial class Form1
    {
        /// <summary>
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 디자이너에서 생성한 코드

        /// <summary>
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.StartButton1 = new System.Windows.Forms.PictureBox();
            this.Logo = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.StartButton1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.Logo)).BeginInit();
            this.SuspendLayout();
            // 
            // StartButton1
            // 
            this.StartButton1.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.StartButton1.Image = global::Meta4.Properties.Resources.start_button1;
            this.StartButton1.Location = new System.Drawing.Point(310, 259);
            this.StartButton1.Name = "StartButton1";
            this.StartButton1.Size = new System.Drawing.Size(188, 156);
            this.StartButton1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.StartButton1.TabIndex = 1;
            this.StartButton1.TabStop = false;
            this.StartButton1.Click += new System.EventHandler(this.StartButton1_Click);
            this.StartButton1.MouseDown += new System.Windows.Forms.MouseEventHandler(this.StartButton1_MouseDown);
            this.StartButton1.MouseUp += new System.Windows.Forms.MouseEventHandler(this.StartButton1_MouseUp);
            // 
            // Logo
            // 
            this.Logo.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.Logo.Image = global::Meta4.Properties.Resources.Logo_Image;
            this.Logo.Location = new System.Drawing.Point(120, 12);
            this.Logo.Name = "Logo";
            this.Logo.Size = new System.Drawing.Size(560, 313);
            this.Logo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.Logo.TabIndex = 0;
            this.Logo.TabStop = false;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.ButtonHighlight;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.StartButton1);
            this.Controls.Add(this.Logo);
            this.Name = "Form1";
            this.Text = "Form1";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            ((System.ComponentModel.ISupportInitialize)(this.StartButton1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.Logo)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.PictureBox Logo;
        private System.Windows.Forms.PictureBox StartButton1;
    }
}

