import torch
import torch.nn as nn
from ai_model.config import INPUT_DIM

class MyModel(nn.Module):
    def __init__(self):
        super(MyModel, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(INPUT_DIM, 512),
            nn.ReLU(),
            nn.Linear(512, 1),
            nn.Sigmoid()
        )
        print("Model initialized.")

    def forward(self, x):
        return self.fc(x)

def load_trained_model(model_path):
    model = MyModel()
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()
    return model
