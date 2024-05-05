using Microsoft.Web.WebView2.Core;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace SampleApplication
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public string url = @"http://127.0.0.1:5500/index.html"; // Add your hosted URL here

        public MainWindow()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Load WebView2 when the window is loaded
        /// </summary>
        private async void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // Ensure that the CoreWebView2 environment is initialized asynchronously
            await webView.EnsureCoreWebView2Async(null);
            // Navigate the CoreWebView2 instance to the specified URL
            webView.CoreWebView2.Navigate(url);

            // Subscribe to the WebMessageReceived event of CoreWebView2
            webView.CoreWebView2.WebMessageReceived += WebView_WebMessageReceived;
        }

        /// <summary>
        /// Search button click event
        /// </summary>
        private async void BtnSearch_Click(object sender, RoutedEventArgs e)
        {
            // Execute JavaScript to trigger the search button click in the web view
            await webView.CoreWebView2.ExecuteScriptAsync("document.getElementById('btn-search').click();");
        }

        /// <summary>
        /// Text box change event to mirror the WPF text box in the web text box
        /// </summary>
        private async void TxtCountryName_TextChanged(object sender, TextChangedEventArgs e)
        {
            // Execute JavaScript to set the value of the web text box to the WPF text box value
            await webView.CoreWebView2.ExecuteScriptAsync($"document.getElementById('txt-country-input').value = '{TxtCountryName.Text.Trim()}';");
        }

        /// <summary>
        /// Subscribable method to handle incoming messages
        /// </summary>
        private void WebView_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            string message = args.TryGetWebMessageAsString();

            // Incoming message format => "key : value"
            string[] messageArray = message.Split(':');

            if (messageArray.Length == 2)
            {
                string key = messageArray[0];
                string value = messageArray[1];

                if (key == "population")
                {
                    MessageBox.Show($"{TxtCountryName.Text.Trim()} : {key} is {value}");
                }
            }
        }
    }
}

    